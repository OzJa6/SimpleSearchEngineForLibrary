const getWeatherDate = () => Promise.resolve( [
    {
        location: {
            name: 'Portland',
            coordinates: { lat: 45.51, lng: -122.67 },
        },
        forecastUrl: 'https://one',
        iconUrl: 'https://iconOne',
        weather: 'maybe rains',
        temp: '12',
    },
    {
        location: {
            name: 'Bend',
            coordinates: { lat: 55.51, lng: 122.67 },
        },
        forecastUrl: 'https://two',
        iconUrl: 'https://icontwo',
        weather: 'no rains',
        temp: '33',
    },
])

const weatherMiddleware = async (req, res, next) => {
    if(!res.locals.partials) res.locals.partials = {}
    res.locals.partials.weatherContext = await getWeatherDate()
    next()
}

module.exports = weatherMiddleware