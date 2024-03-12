# shadcn-custom v 0.0.0

Planned to be modified version of shadcn components that are easily importable and have slight more customization. Currently package contains a simple button which takes in a label property which sets the value of the value displayed on the button. Plan to add custom components to this package and allow them to be installed/copied into the system using ``` npx shadcn-custom``` and correctly configure it how shadcn works. Plan on making this a private package but it is public for testing purposes.


## Changes from default shadcn

There was a bug with raddix-ui which caused the popover to not display certain components like a combobox properly, the dropdown would not be clickable as the click was being registered behind it. I modified it so that theres a context for dialog that lets the popover know to render inside a div instead of the popoverPrimitive thats used by default. This was done to fix that bug while avoiding any possible bugs that could arise from the change,

Certain components now have variants. The variants can be appended in the component files themselves. Thats why I plan on making this installable like the shadcn-ui package, so that the components can be easily edited.
