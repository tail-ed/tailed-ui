# shadcn-tailed

Planned to be modified version of shadcn components that are easily importable and have slight more customization. Currently package contains a simple button which takes in a label property which sets the value of the value displayed on the button. Plan to add custom components to this package and allow them to be installed/copied into the system using ``` npx @tail-ed/shadcn-tailed``` and correctly configure it how shadcn works.It was private but it is now public. Relies on packages like raddix-ui and tailwind which will also be installed.

**Download the latest version as older versions are filled with bugs or don't work**

### LATEST UPDATE:

Everything is working as I intended it to run. The main way of importing these files should be with npx/pnpx/etc and by running the init command so that files are copies locally and can be modified to your liking. Package has been published on NPM so you no longer need to specify github as its location and no token is required to download/copy these files.

## Changes from default shadcn

There was a bug with raddix-ui which caused the popover to not display certain components like a combobox properly, the dropdown would not be clickable as the click was being registered behind it. I modified it so that theres a context for dialog that lets the popover know to render inside a div instead of the popoverPrimitive thats used by default. This was done to fix that bug while avoiding any possible bugs that could arise from the change,

Certain components now have variants. The variants can be appended in the component files themselves. Thats why I plan on making this installable like the shadcn-ui package, so that the components can be easily edited.

## How to download

Package is no longer private and has been published on NPM instead of just GitHub so installing it is simpler now. The recommended way is by running the command below. Should be compatible with npm and yarn as well.

```bash
pnpx @tail-ed/shadcn-custom init
```

<hr/>

## Configuring the lib/utils.ts file

If you already have a utils.ts file in a lib folder, then the cli will skip copying that file to avoid overwriting any existing code, instead you should add the following lines to it. If they already exist then you dont need to follow this step:

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
