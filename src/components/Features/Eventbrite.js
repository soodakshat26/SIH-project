// class EventBrite {
//     // Constructor when instantiate
//     constructor() {
//         this.auth_token = 'QMIJLXD2VXWBFBAOLQEM';
//         this.orderby = 'date';
//     }

//     // Get the Events from API

//     async queryAPI(eventName, category) {
//         const eventsResponse = await fetch(`https://www.eventbriteapi.com/v3/events/search/?q=${eventName}&sort_by=${this.orderby}&categories=${category}&token=${this.auth_token}`);

//         // Wait for response and return as json

//         const events = await eventsResponse.json();

//         return {
//             events
//         }
//     }


//     // Get categories from API
//     async getCategoriesAPI() {
//         // Query the API
//         const categoriesResponse = await fetch(`https://www.eventbriteapi.com/v3/categories/?token=${this.auth_token}`);

//         // Hold for the response and then return as json
//         const categories = await categoriesResponse.json();

//         return {
//             categories
//         }
//     }
// }

class EventBrite {
    constructor() {
        this.auth_token = 'KT7QRIQDYJOJXG67SI'; 
        this.orderby = 'date';
    }

    async queryAPI(eventName, category) {
        const eventsResponse = await fetch(
            `https://www.eventbriteapi.com/v3/events/search/?q=${eventName}&sort_by=${this.orderby}&categories=${category}&token=${this.auth_token}`
        );
        const events = await eventsResponse.json();
        return { events };
    }

    async getCategoriesAPI() {
        const categoriesResponse = await fetch(
            `https://www.eventbriteapi.com/v3/categories/?token=${this.auth_token}`
        );
        const categories = await categoriesResponse.json();
        return { categories };
    }
}

export default EventBrite; // Ensure this is the default export
