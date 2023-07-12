import fs from 'fs';
import path from 'path';

/* Symlink react and react-dom directories to preact/compat in order for the
 * aliasing to work consistently in dev mode with SSR
 * The Vite dev server SSR function does not seem to respect any other module
 * aliasing technique
 */

const reactPath = path.resolve(process.cwd(), 'node_modules', 'react');
const reactDomPath = path.resolve(process.cwd(), 'node_modules', 'react-dom');
const preactCompatPath = path.resolve(
    process.cwd(),
    'node_modules',
    'preact',
    'compat'
);

const createPreactCompatSymLink = (path) => {
    try {
        const lstat = fs.lstatSync(path, { throwIfNoEntry: false });
        if (lstat?.isSymbolicLink()) {
            console.log(`${path} is already a symlink, skipping`);
            return;
        }

        const stat = fs.statSync(path, { throwIfNoEntry: false });
        if (stat) {
            console.log(`${path} exists as directory, deleting`);
            fs.rmSync(path, { recursive: true });
        }

        fs.symlinkSync(preactCompatPath, path, 'dir');
    } catch (e) {
        console.error(`Failed to create symlink from ${path} - ${e}`);
    }
};

createPreactCompatSymLink(reactPath);
createPreactCompatSymLink(reactDomPath);
