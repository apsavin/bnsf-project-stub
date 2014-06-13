# Stub to start a new [BEM](http://bem.info) project based on [bnsf](https://github.com/apsavin/bnsf)

Project-stub is a template project repository used for bnsf projects creation.

There are two main BEM libraries are linked here by default:

* [bem-core](https://github.com/bem/bem-core)  
* [bem-components](https://github.com/bem/bem-components)

And, of course, [bnsf](https://github.com/apsavin/bnsf) itself.

There are some examples of blocks in desktop.blocks directory. Feel free to delete it.

## Fast start:

    ```bash
    $ git clone https://github.com/apsavin/bnsf-project-stub.git your-project-name
    $ cd your-project-name
    $ npm i
    $ bem make
    ```

Then, you need to start two daemons.

1. bem server for static resources:
    ```bash
    $ bem server
    ```
2. node server for application itself:
   ```bash
   $ npm start
   ```
