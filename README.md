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
