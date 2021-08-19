# Ejercicio 1

Los principales problemas que veo son el uso de condicionales para descubrir el tipo servicio o contenido multimedia y el acceso directo a variables de otras clases, como por ejemplo los precios o la tarifa adicional.

Los cambios realizados intentan simplificar el método `getTotal()` y delegar el cálculo del precio a cada servicio y contenido.

El archivo **Ejercicio1.js** contiene todos los cambios y un ejemplo de uso. Se puede ejecutar con el comando `node Ejercicio1.js`.

### Clase MultimediaContent

En esta clase añado los métodos `getStreamingPrice()` y `getDownloadPrice()` qué actúan como 'getters' de las variables `streamingPrice` y `downloadPrice`.

```
class MultimediaContent {
    constructor(title, streamingPrice, downloadPrice, duration, adult, size) {
        this.title = title;
        this.streamingPrice = streamingPrice;
        this.downloadPrice = downloadPrice;
        this.duration = duration;
        this.adult = adult;
        this.size = size;
    }

    getStreamingPrice() {
        return this.streamingPrice;
    }

    getDownloadPrice() {
        return this.downloadPrice;
    }
}
```

### Clase PremiumContent

Esta clase hereda de **MultimediaContent** y sobreescribe los dos métodos nuevos para añadir la tarifa prémium adicional.

```
class PremiumContent extends MultimediaContent {
    constructor(title, streamingPrice, downloadPrice, duration, adult, size, additionalFee) {
        super(title, streamingPrice, downloadPrice, duration, adult, size);
        this.additionalFee = additionalFee;
    }

    getStreamingPrice() {
        return this.streamingPrice + this.additionalFee;
    }

    getDownloadPrice() {
        return this.downloadPrice + this.additionalFee;
    }
}
```

### Clase Service

En la clase **Service** substituyo el método de `getMultimediaContent()` por otro que obtiene el precio del contenido directamente. En la definición de este nuevo método lanzo un Error para obligar a las subclases a implementarlo, simulando así un método abstracto.

```
class Service {
    constructor(multimediaContent) {
        this.multimediaContent = multimediaContent;
    }

    getPrice() {
        throw new Error("This method must be implemented on all subclasses.");
    }
}
```

### Clase StreamingService y DownloadService

En las clases **StreamingService** y **DownloadService** implemento el nuevo método de **Service**, llamando en cada caso al método pertinente de **MultimediaContent**.

```
class StreamingService extends Service {
    constructor(multimediaContent) {
        super(multimediaContent);
    }

    getPrice() {
        return this.multimediaContent.getStreamingPrice();
    }
}

class DownloadService extends Service {
    constructor(multimediaContent) {
        super(multimediaContent);
    }

    getPrice() {
        return this.multimediaContent.getDownloadPrice();
    }
}
```

### Clase RegisteredUser

Finalmente en la classe **RegisteredUser** uso un reducer en el array de servicios, llamando `getPrice()` en cada uno. De esta forma evitamos las comprobaciones de clases y el acceso a variables de forma directa y delegamos el cálculo del precio a cada servicio.

```
class RegisteredUser {
    constructor(services = []) {
        this.services = services;
    }

    getTotal() {
        return this.services.reduce((sum, currService) => sum + currService.getPrice(), 0);
    }
}
```

# Ejercicio 2

### Explicación

He creado un nuevo proyecto de React con CRA usando Typescript. He incorporado Redux al proyecto con la acción de Añadir Marcador. Se puede ver el código en el directorio `src/redux` y se usa su proveedor en el archivo `src/index.tsx`.

A continuación he añadido la API de Google que se carga en cuanto el componente `src/App.tsx` se renderiza por primera vez. Todo el código relacionado con las APIs de Google Maps se encuentra en un contexto de React en el archivo `src/contexts/MapsAPI.txt`. Una vez cargada la API, el componente `src/App.tsx` renderiza los componentes `src/components/Map.tsx` y `src/components/Search.tsx`.

El componente `src/components/Map.tsx` instancia y enseña el mapa. Esta instancia solo se crea la primera vez y se guarda en el contexto `src/contexts/MapsAPI.txt`.

El componente `src/components/Search.tsx` muestra la barra de búsqueda y cuando el usuario para de escribir, llama a la API de Google Places. Esta llamada a la API puede verse también en el archivo `src/contexts/MapsAPI.txt`. Cada sugerencia es una instancia de la clase `src/components/Suggestion.tsx` y se pueden seleccionar para añadir un marcador al mapa mediante el ratón o el teclado. La información de cada uno de estos marcadores se guarda en la store de Redux.

Finalmente he implementado un test usando Snapshots que se puede ver en el directorio `src/components/__test__/`.

### Como Ejecutar

Para ejecutar el proyecto seguir estos pasos

-   [ ] Es necesario tener instalado Node.js.

-   [ ] Clonar el Repositorio con `git clone https://github.com/CarlesRojas/react-test.git` y entrar en el directorio con `cd react-test`

-   [ ] Crear un archivo `.env` en el directorio base del repositorio con el contenido que he adjuntado en el email (Esto contiene la key de Google Maps que no se sube a Github).

-   [ ] Instalar dependencias con `npm i`

-   [ ] Iniciar la app con `npm start`

-   [ ] Los tests pueden ejecutarse con `npm run test`
