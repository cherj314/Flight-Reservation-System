class User {
    constructor() {
        this.table = 'users';
        this.user_id = '';
    }

    setInfo({user_id, name, address, email, credit_card_number, ticket, lounge, news}) {
        this.user_id = user_id;
        this.name = name;
        this.address = address;
        this.email = email;
        this.credit_card_number = credit_card_number;
        this.ticket = ticket;
        this.lounge = lounge;
        this.news = news;
        return this;
    }
}

module.exports = User;
