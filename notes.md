# Uruchomienie aplikacji w Node
_node app.js_

# Lista wbudowanych modułów Node
nodejs.org/api/

# Require
const fs = require('fs');

# module.exports
Dla każdego pliku możemy podejrzeć module
_console.log(module)_

Module zawiera pole exports - wszystkie znajdujące się w nim obiekty, metody są eksportowane z modułu i można ich użyć "na zewnątrz".

Żeby wyeskportować coś z modułu używamy:
_module.exports.add = (a, b) => a + b;_

# Inicjalizacja NPM w projekcie
_npm init_

# Instalacja modułu z npm
_npm install moduleName_

##Require zainstalowany moduł
Na przykładzie lodash
*const _ = require('lodash');* 
Nazwa modułu dokładnie taka, jak pojawia się w package.json

Kolejność jest taka, że node najpierw będzie szukał wewnątrz własnych modułów (core modules) - jak nie znajdzie odpowiedniego modułu, to szuka w node_modules