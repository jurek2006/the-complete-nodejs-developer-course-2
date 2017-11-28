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

#Automatyczne restartowanie aplikacji, kiedy zrobimy zmiany, za pomocą nodemon
Nodemon to narzędzie wiersza poleceń. Aby zainstalować moduły uruchamiane z wiersza poleceń 
_npm install nodemon -g_
Flaga -g to skrót od global. Nie są one dodawane do projektu, tylko instalowane na urządzeniu. 

Po zainstalowaniu mamy na komputerze nową komendę:
_nodemon_

Uruchamiamy app.js za pomocą polecenia:
_nodemon app.js_

#Input danych użytkownika