import api from './http'


const getStations=params=>api.get('/max/getStations',params);

const getTickets=params=>api.get('/max/queryTicketInfo',params);

export default{
    getStations,
    getTickets
}