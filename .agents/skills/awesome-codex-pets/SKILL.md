```markdown
# awesome-codex-pets Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and conventions used in the `awesome-codex-pets` JavaScript repository. You'll learn about file naming, import/export styles, commit patterns, and how to write and run tests. This guide is ideal for contributors who want to maintain consistency and quality in the codebase.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `petList.js`, `fetchData.js`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```js
    import { getPetList } from './petList';
    ```

### Export Style
- Use **named exports** for functions, objects, or constants.
  - Example:
    ```js
    // petList.js
    export function getPetList() { ... }
    ```

### Commit Patterns
- Commit messages are **freeform** (no strict prefix), but are concise (average 29 characters).
  - Example:  
    ```
    add fetch for pet details
    fix typo in petList
    ```

## Workflows

### Adding a New Feature
**Trigger:** When you want to introduce a new feature or functionality  
**Command:** `/add-feature`

1. Create a new file using camelCase (e.g., `newFeature.js`).
2. Implement the feature with named exports.
3. Import the new feature using a relative path where needed.
4. Write a corresponding test file named `newFeature.test.js`.
5. Commit your changes with a clear, concise message.
6. Push your branch and open a pull request.

### Fixing a Bug
**Trigger:** When you need to correct an error or bug  
**Command:** `/fix-bug`

1. Locate the relevant file(s) using camelCase naming.
2. Make the necessary code corrections.
3. Update or add a test in a `*.test.js` file to cover the fix.
4. Commit with a clear message describing the fix.
5. Push and open a pull request.

## Testing Patterns

- Test files are named with the pattern `*.test.*` (e.g., `petList.test.js`).
- The testing framework is **unknown**, so refer to existing test files for structure.
- Place tests alongside or near the files they cover.

**Example:**
```js
// petList.test.js
import { getPetList } from './petList';

test('returns a list of pets', () => {
  expect(getPetList()).toBeInstanceOf(Array);
});
```

## Commands
| Command       | Purpose                                 |
|---------------|-----------------------------------------|
| /add-feature  | Start the process to add a new feature  |
| /fix-bug      | Begin workflow to fix a bug             |
```
