import api from './http'


const getStations=params=>api.get('/max/getStations',params);

export default{
    getStations
}