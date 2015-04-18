#Introduction

I was looking for some ways of writing CLI. Then i found an awesome way of writing cli in Java Script and nodejs as npm module. And this is easy as it writing a simple js app in node app. In my previous post i wrote my Bash Profile, this will definitely be a good addition in my Bash Profile.

I created Git Cli module, that you can use to search git repositories, based on keywords, owner and language of repository. Let's jump into the code and have a look how it works.

##Run locally

You just need to have node installed in your machine.

Download the code and enter it into folder. And execute following command.

<code>npm install</code>

This will download all the dependencies specified in package.json. i.e. commander, request and chalk.

And if you want to install this locally to use gitcli command, execute following command.

Note you need make gitcli.js file executable. 

you need to execute: <code>chmod 755 gitcli.js</code>

<code>npm install -g</code>

After this you can able to execute command from your shell. Following command will print search result of git-cli repo on github.

<code>gitcli git-cli -o muhammadarslan</code>

##Install from npm-registery

This is also published on npm-registry. You can also install it by executing following command.

<code>npm install gitcli</code>

Enjoy!
