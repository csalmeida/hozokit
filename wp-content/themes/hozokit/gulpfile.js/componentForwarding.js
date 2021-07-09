// Node file system utilities, used to track deletion and creation of files.
const fs = require('fs')
const path = require("path")

// Components partial path is where all styles from components
// that live in /templates/components are forwared to.
const componentsPartialPath = `./styles/_components.scss`

/**
 * Reads files contents of the components partial.
 * Useful to then determine if any statements need to be updated.
 * @param {string} componentsPartialPath The part to the components partial file. Usually called _components.scss
 * @return {string} All file data in a string format. Useful to pass through a RegEx check.
 */
function readComponentsPartial(componentsPartialPath) {
  const filePath = componentsPartialPath

  try {
    // Reads file and returns data as a string.
    const fileData = fs.readFileSync(filePath)
    return fileData.toString()
  } catch (error) {
    console.error(error)
  }
}

/**
 * Removes component `@forward` statement if corresponding style.scss file is not existent.
 * @param {string} partialPath A file path to remove the statement from. Usually points to _components.scss
 * @param {string} componentPath The path to the component, it could be e.g /button or something more complex such as /buttons/dropdown
 */
function removeComponent(partialPath, componentPath) {

  try {
    // Read components partial's contents.
    const fileData = fs.readFileSync(partialPath)

    // Matches any forward statements with a specific component directory in it.
    const pattern = new RegExp(`@forward ('|")(.*)(\/${componentPath})(\/style)('|");`, 'gim')

    // Replaces statement with white space, removing it.
    const newValue = removeBlankLines( fileData.toString().replace(pattern, '') )

    // Writes change to the file.
    try {
      fs.writeFileSync(partialPath, newValue)
    } catch (error) {
      console.error(error)
    } // End of writing.

  } catch (error) {
    console.error(error)
  }
}


/**
 * Adds a component `@forward` statement if corresponding style.scss file is added.
 * No new statement is added if one is already present.
 * @param {string} partialPath A file path to add the statement to. Usually points to _components.scss
 * @param {string} componentPath The path to the component, it could be e.g /button or something more complex such as /buttons/dropdown
 */
function addComponent(partialPath, componentPath) {
  try {
    // Reads the components file.
    const fileData = fs.readFileSync(partialPath)

    // Matches any forward statements with a specific component directory in it.
    const pattern = new RegExp(`@forward ('|")(.*)(\/${componentPath})(\/style)('|");`, 'gim')

    // The goal is to just determine if there's a match.
    // true means the style partial is present in the component's file.
    // No action is taken if there is a match.
    const isPresentInFile = pattern.test(fileData.toString())

    // In the case a @forward to this style.scss is not present file, add one.
    if (!isPresentInFile) {
      // String that is appended to the file with the component path.
      const forwardStatement = `\n@forward "../templates/components/${componentPath}/style";`

      // Appends new statement to current file data.
      const updatedData = removeBlankLines( fileData.toString() + forwardStatement )

      // Writes change to the file.
      try {
        fs.writeFileSync(partialPath, updatedData)
      } catch (error) {
        console.error(error)
      } // End of writing.
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * Extracts all component declarations in _components.scss and removes entries for ones that no longer exist.
 * Used in cases where a component might have been removed and could still be present in the partial.
 * @param {string} partialPath A file path to add the statement to. Usually points to _components.scss
 * @param {string} componentPathPattern A RegEx pattern used to find component statements in the file. Should match only the path to the component and not the whole `@forward` statement.
 * @param {string} componentsDir The path to where components are stored. This is used to determine if styles for the component exist.
 */
function removeUnlinkedForwards(partialPath, componentPathPattern, componentsDir) {
    // Finds all component paths declared in ./styles/_components.scss
    const declaredComponents = readComponentsPartial(partialPath).match(componentPathPattern)

    // Check if a style file exists for each path, remove statements when the file is missing.
    declaredComponents.forEach(componentPath => {
      const stylesFile = `${componentsDir}/${componentPath}/style.scss`
      // Determine if the file exists or not.
      try {
        if(fs.existsSync(stylesFile)) {
          // When the file exists do nothing.
        } else {
          // When the file does not exist, remove the component declaration from the _components.scss file.
          removeComponent(partialPath, componentPath)
        }
      } catch (err) {
        console.error(err)
      }
    })
}

/**
 * Removes blank lines from a string.
 * @param {string} value File data in a string format. 
 * @returns {string} Value with no blank lines.
 */
function removeBlankLines(value) {
  // Pattern to remove blank lines in a document.  
  const blankLines = new RegExp(/(^[ \t]*\n)/gm)
  return value.replace(blankLines, "")
} 

/**
 * Recursively gets hold of all style files in a directory and returns all paths where they're at.
 * Used to make sure no nested component folders are missed when watching files.
 * @param {string} directory Path to the directory it should be read. Usually the components directory.
 * @param {array} arrayOfFiles Used internaly to keep track of files through subdirectories since the function calls itself.
 * @returns {array|undefined} An array of paths, usually component paths.
 */
function readAllFiles(directory, arrayOfFiles) {
  // The components directory that is about to be scanned.
  const componentsDir = directory

  try {
    // Initially reads the directory.
    const files = fs.readdirSync(componentsDir)

    // Updates array to provided values (from a previous iteration) or keeps it blank if it's the first one.
    arrayOfFiles = arrayOfFiles || []
    
    // For every file found add it to the list.
    files.forEach(function(file) {
      // If file is a directory run the function again adding all paths already collected.
      if (fs.statSync(componentsDir + "/" + file).isDirectory()) {
        arrayOfFiles = readAllFiles(componentsDir + "/" + file, arrayOfFiles)
      } else {
        // Proceed to add item to the list if a file is present.
        // Ignores any other files such as index.twig.
        if (file === 'style.scss') {
          // Pattern used to pluck component path out of string.
          const componentPathPattern = new RegExp(`(?<=components\/).*(?=\/style)`, "g")
          // Retrieves component path out of string.
          const componentPath = path.join("./", componentsDir, "/", file).match(componentPathPattern)
          // Adds the path to the array.
          arrayOfFiles.push(componentPath)
        }
      }
    })
    
    // Returns the list of paths once there are no more directories to go through.
    return arrayOfFiles
  } catch (error) {
  console.log(error)
  }
}

/**
 * Checks components directory for files and adds or removes any `@forward` statements depending
 * on whether the correspondent style file is present.
 * @param {string} directory Path to the directory it should be read. Usually the components directory.
 * @param {array} componentsPartialPath The partial where component `@forward` statements are added to.
 * @returns {undefined} No return.
 */
function updateComponentForwards(directory, componentsPartialPath) {
  // The components directory that is about to be scanned.
  const componentsDir = directory

  try {
    // Recursively retrieves all style file paths.
    const filePaths = readAllFiles(componentsDir)
    console.log('files found')
    console.log(filePaths)

    // For each file found determine if the directory exists.
    // Determine if a @forward statement should be added or to _components.scss.
    // Has the components directory as a source of truth.
    filePaths.forEach(componentPath => {
      console.log(componentPath)
      // Path to the styles file of the component, used to check for its presence in the directory.
      const stylesFile = `${componentsDir}/${componentPath}/style.scss`

      try {   
        // Determine if the file exists or not.
        if(fs.existsSync(stylesFile)) {
          console.log("The file exists.", componentPath)
          // Add a component `@forward` statement if style file is present.
          addComponent(componentsPartialPath, componentPath)
        } else {
          console.log('The file does not exist.', componentPath)
          // Removes `@forward` statement if the directory is present but not style.scss is.
          removeComponent(componentsPartialPath, componentPath)
        }
      } catch (err) {
        console.error(err)
      }
    })

  } catch (err) {
    console.error(err)
  }
}

/**
 * Keeps components forward statements updated as new 
 * components are added and removed from 'templates/components/*
 * @param {function} callback Used by Gulp as an error-first callaback (https://gulpjs.com/docs/en/getting-started/async-completion#using-an-error-first-callback)
 * @return {undefined} No return.
*/
function componentForwarding(callback) {
  // This pattern is used to find all forwards declared in components.
  const componentNamePattern = new RegExp(`(?<=components\/)(.*\/)?([^\/]*)(?=\/style('|");)`, "g")

  // Where component files (e.g button/index.twig and button/style.scss) are stored. 
  const componentsDir = "./templates/components"
  
  // Scan _components.scss and remove any statements that point to nonexistent files.
  removeUnlinkedForwards(componentsPartialPath, componentNamePattern, componentsDir)
  // Look recursively in the component directory for new components that need to be added to the list, or removed when no style file is present in the directory.
  updateComponentForwards(componentsDir, componentsPartialPath) 
  
  callback()
}

exports.componentForwarding = componentForwarding