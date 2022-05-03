const mainController = {
    home(req, res){
        try {
            res.send('Hello World');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = mainController;