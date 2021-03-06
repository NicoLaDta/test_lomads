const DataLoader = require('dataloader')

const Event = require('../../models/events')
const User = require('../../models/users');

const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {
    return events(eventsIds);
});

const transformEvent = event => {
    return {
        ...event._doc, 
        _id: event.id, 
        date: dateToString(event._doc.date), 
        creator: user.bind(this, event.creator)
    };
};

const transformUser = user => {
    return {
        ...user._doc, 
        _id: user.id, 
    };
};

const transformBooking = booking => {
    return { 
        ...booking._doc, 
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updateAt: dateToString(booking._doc.updatedAt)
    };
}

const events = async eventIds => {
    try{
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return transformEvent(event);
        });
    } catch(err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try{
        const event = await Event.findById(eventId);
        return transformEvent(event);
    }catch (err){
        throw err;
    }
}

const user = async userId => {
    try{
        const user = await User.findById(userId)
        return { 
            ...user._doc, 
            _id: user.id, 
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.transformUser = transformUser;