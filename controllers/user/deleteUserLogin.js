module.exports = async (request, response, next) => {

    try {
        return response.clearCookie('token').sendStatus(200);
    } catch (error) {
        return response.status(500).json(error);
    }
};