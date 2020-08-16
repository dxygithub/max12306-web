import api from './http'


const getStations=params=>api.get('/max/getStations',params);

const getTickets=params=>api.get('/max/queryTicketInfo',params);

const getTicketPrice=params=>api.get('/max/queryTicketPrice',params);

const getImgCapthcha=params=>api.get('/max/getImgCapthcha',params);

const checkCapthcha=params=>api.get('/max/checkImgCapthcha',params);

export default{
    getStations,
    getTickets,
    getTicketPrice,
    getImgCapthcha,
    checkCapthcha
}