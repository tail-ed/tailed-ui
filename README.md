# shadcn-custom

Planned to be modified version of shadcn components that are easily importable and have slight more customization. Currently package contains a simple button which takes in a label property which sets the value of the value displayed on the button. Plan to add custom components to this package and allow them to be installed/copied into the system using ``` npx shadcn-custom``` and correctly configure it how shadcn works. Plan on making this a private package but it is public for testing purposes.

## Changes from default shadcn

There was a bug with raddix-ui which caused the popover to not display certain components like a combobox properly, the dropdown would not be clickable as the click was being registered behind it. I modified it so that theres a context for dialog that lets the popover know to render inside a div instead of the popoverPrimitive thats used by default. This was done to fix that bug while avoiding any possible bugs that could arise from the change,

Certain components now have variants. The variants can be appended in the component files themselves. Thats why I plan on making this installable like the shadcn-ui package, so that the components can be easily edited.

## How to download

This is a private npm package so to install it a few extra steps are required, this is the same case for any other private package:

### 1. Generate a GitHub access token.

I use the classic token because it's easier but the newer repo specific tokens should work too. To generate one go to your profile settings. Or if you are signed in your browser already you can click this link: [Sign in to GitHub · GitHub](https://github.com/settings/profile). 

@

<img src="file:///C:/Users/asari/AppData/Roaming/marktext/images/2024-03-13-00-55-30-image.png" title="" alt="" data-align="center">

Then scroll down until you reach "Developper Settings"

<img src="file:///C:/Users/asari/AppData/Roaming/marktext/images/2024-03-13-00-58-45-image.png" title="" alt="" data-align="center">

In there under Personal Access Token click either of the options. In my case I chose the classic option.
<img src="file:///C:/Users/asari/AppData/Roaming/marktext/images/2024-03-13-00-59-49-image.png" title="" alt="" data-align="center">

From here it should be pretty self explanatory, you can limit the access code to just read in order to avoid having too much access to your account.

### 2. Add account info into your project

Create a `.npmrc` file a the root of your project and paste the following:

```
@sarimsyed:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_TOKEN
```

Now you can run the `npm install` command to install the package:

```bash
npm i @sarimsyed/shadcn-custom@latest
```

You can specify the version after the "@" sign for a specific version, but at this point the older versions are useless and I highly recommend keeping up to date.
