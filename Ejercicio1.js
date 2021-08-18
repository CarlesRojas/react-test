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

class Service {
    constructor(multimediaContent) {
        this.multimediaContent = multimediaContent;
    }

    getPrice() {
        throw new Error("This method must be implemented on all subclasses.");
    }
}

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

class RegisteredUser {
    constructor(services = []) {
        this.services = services;
    }

    getTotal() {
        return this.services.reduce((sum, currService) => sum + currService.getPrice(), 0);
    }

    addService(service) {
        this.services.push(service);
    }
}

const movie1 = new MultimediaContent("Movie1", 5, 10, 120, true, 1024);
const movie2 = new MultimediaContent("Movie2", 5, 10, 120, true, 1024);
const movie3 = new MultimediaContent("Movie3", 5, 10, 120, true, 1024);
const movie4 = new MultimediaContent("Movie4", 5, 10, 120, true, 1024);
const premiumMovie1 = new PremiumContent("PremiumMovie1", 5, 10, 120, true, 1024, 10);
const premiumMovie2 = new PremiumContent("PremiumMovie2", 5, 10, 120, true, 1024, 10);
const premiumMovie3 = new PremiumContent("PremiumMovie3", 5, 10, 120, true, 1024, 10);
const premiumMovie4 = new PremiumContent("PremiumMovie4", 5, 10, 120, true, 1024, 10);

const streamingService1 = new StreamingService(movie1); // Precio: 5
const streamingService2 = new StreamingService(movie2); // Precio: 5
const streamingService3 = new StreamingService(premiumMovie1); // Precio: 15
const streamingService4 = new StreamingService(premiumMovie2); // Precio: 15
const downloadService1 = new DownloadService(movie3); // Precio: 10
const downloadService2 = new DownloadService(movie4); // Precio: 10
const downloadService3 = new DownloadService(premiumMovie3); // Precio: 20
const downloadService4 = new DownloadService(premiumMovie4); // Precio: 20

const user = new RegisteredUser([streamingService1, streamingService2, streamingService3, streamingService4, downloadService1, downloadService2, downloadService3, downloadService4]);
console.log(user.getTotal()); // Precio total: 100
