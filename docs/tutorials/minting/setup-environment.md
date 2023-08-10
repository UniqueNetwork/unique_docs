# Setting up an environment

In this tutorial, we will walk you through setting up your development environment. We'll cover the installation of git, node.js, and ensuring that everything is properly configured.

### 1. Install Node.js

There are various methods to install Node on your machine. We recomend to use [nvm for Mac](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows).

#### Mac OS

> Install & Update Script
> 
> To install or update nvm, you should run the install script. To do that, you may either download and run the script manually, or use the following cURL or Wget command:
> ```sh:no-line-numbers
> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
> ```
>
> ```sh:no-line-numbers
> wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
> ```
>
> Running either of the above commands downloads a script and runs it. The script clones the nvm repository to \~/.nvm, and attempts to add the source lines from the snippet below to the correct profile file (\~/.bash_profile, \~/.zshrc, \~/.profile, or \~/.bashrc).
>
> ```sh
> export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
> [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
> ```

After installation, you may need to reload your terminal, and than set your node.js version:

```sh:no-line-numbers
nvm use 18
```

#### Windows

Follow this steps from [nvm-windows documentation](https://github.com/coreybutler/nvm-windows#installation--upgrades)

You can also follow this [guide from npm Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

---

Once you’re done, run `node --version` on a terminal to check your installation:

```sh:no-line-numbers
node --version
```

### 2. Install Git

Check your version running following command in your terminal:

```sh:no-line-numbers
git -v
```

If you see your version, e.g. `git version 2.40.1` you already have git installed. If you don't see a version number, please follow the instructions provided on the [official website](https://git-scm.com/)

After installation, check your version again.

### 3. Optional: Install IDE

We recommend using [Visual Studio Code](https://code.visualstudio.com/).


🎉 Great! You're all set now.

Next, you can learn

1. [Generative NFT guide](./generative-nft.md)
2. [Mass NFT minting guide](./mass-minting.md)