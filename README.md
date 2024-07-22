# tailed-ui

Planned to be modified version of shadcn components that are easily importable and have slight more customization. Currently package contains a simple button which takes in a label property which sets the value of the value displayed on the button. Plan to add custom components to this package and allow them to be installed/copied into the system using ```npx @tail-ed/tailed-ui``` and correctly configure it how shadcn works.It was private but it is now public. Relies on packages like raddix-ui and tailwind which will also be installed.

**Download the latest version as older versions are filled with bugs or don't work**

### LATEST UPDATE:

Everything is working as I intended it to run. The main way of importing these files should be with npx/pnpx/etc and by running the init command so that files are copies locally and can be modified to your liking. Package has been published on NPM so you no longer need to specify github as its location and no token is required to download/copy these files.

## Changes from default shadcn

There was a bug with raddix-ui which caused the popover to not display certain components like a combobox properly, the dropdown would not be clickable as the click was being registered behind it. I modified it so that theres a context for dialog that lets the popover know to render inside a div instead of the popoverPrimitive thats used by default. This was done to fix that bug while avoiding any possible bugs that could arise from the change,

Certain components now have variants. The variants can be appended in the component files themselves. Thats why I plan on making this installable like the shadcn-ui package, so that the components can be easily edited.

## How to download

Package is no longer private and has been published on NPM instead of just GitHub so installing it is simpler now. The recommended way is by running the command below. Should be compatible with npm and yarn as well.

```bash
pnpx @tail-ed/tailed-ui init
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

# Testing your components with storybook

Storybook is a great tool that allows components to be previewed in an interactive environment. It also allows the creation of unit tests which can be run through the browser client. 

Storybook and its dependencies should already be installed as dev dependencies after `npm install` is run.

## Using storybook
Storybook can be run by running
```
npm run storybook
```
This should open a browser window and display: 

![image](https://i.ibb.co/wwq004c/storybook.png)

On the left side is where each story that's been created is displayed and they can be viewed by being clicked.


## Writing Stories

### File creation
Writing stories is a little different from implementing a component as its set up differently. In the `src/stories` create a new file and name it similarly to this: `Component.stories.ts`. 

### Story format

A few things are required to start writing the story. Import `Meta` and `StoryObj` from `@storybook/react` as well as the component of your choice:

``` tsx
import type { Meta, StoryObj } from '@storybook/react';
import {Textarea} from '../components/ui/textarea'

```

#### Metadata

A meta tag needs to be created for the component's metadata. That is done by following this structure

```ts
const meta : Meta<typeof Textarea> = { 
    title: 'components/ui/Textarea',
    component: Textarea,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],




} satisfies Meta<typeof Textarea>;
```

A constant of type of Textarea is declared. This constant is given a `title` to identify it. The `component` property should be set as the component itself. 

The `parameters` are where parameters can be set, in the Textarea example you can see that `layout` is set to `centered`.

`Tags` are what you want the story to be tagged as,

Export the `meta` tag as default and create a new type called `Story` of type meta.

```ts
export default meta;
type Story = StoryObj<typeof meta>;
```

#### Story creation
Creating the stories is straightforward from here,
export `Story` constants that represent each story and these story constants can have args.

```ts
export const Primary: Story = {
    args: {
        "variant": "default",
    }
}
```
In this example the `"variant"` property of `Textarea` is set to `"default"`. The variant property changes the style of the Textarea based on already created variants and this is how they are able to be set within a story.

### Complex Components Containing Sub-components

Creating a story for a component made up of multiple smaller components requires a bit more work. Inside the `stories` folder there is a file named `Alertdialog.tsx` which uses all the smaller components to create an alert dialog.

```tsx
import React from 'react'
import {  AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,} from '../components/ui/alert-dialog'

import { Button } from '../components/ui/button'

export function AlertDialogDemo() {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  ```

An AlertDialog needs all these other components in order to function properly so it needs to be assembled in a separate file in order to write a story for it. 

#### AlertDialog Story Example

The implementation of the story is similar to the previous example:

```ts
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import {Textarea} from '../components/ui/textarea'


const meta : Meta<typeof Textarea> = { 
    title: 'Example/Textarea',
    component: Textarea,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],




} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        "variant": "default",
    }
}

export const Secondary: Story = {
    args: {
        "variant": "classic",
    }
}
```
This will display it as it was intended when Storybook is run.

## Storybook Testing

Storybook comes with functionality to run tests to test the components to ensure it is working correctly. Currently no tests have been implemented as the testing was done manually for each component before the components were put in their own library. Testing simple components is straight forward but it might require a bit more work for the complex components like the AlertDialog.

The plan is the eventually write tests for each components and when they are created this README file will be updated to explain how to write your own tests.
