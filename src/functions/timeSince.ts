// Function to get the time since a date has passed
// Might be wonky if in another timezone
export default function timeSince(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " år";
    }

    interval = seconds / 2592000;
    if (interval > 1) {
        if (interval > 2) {
            return Math.floor(interval) + " månader";
        }
        return Math.floor(interval) + " månad";
    }

    interval = seconds / 86400;
    if (interval > 1) {
        if (interval > 2) {
            return Math.floor(interval) + " dagar";
        }
        return Math.floor(interval) + " dag";
    }

    interval = seconds / 3600;
    if (interval > 1) {
        if (interval > 2) {
            return Math.floor(interval) + " timmar";
        }
        return Math.floor(interval) + " timme";
    }

    interval = seconds / 60;
    if (interval > 1) {
        if (interval > 2) {
            return Math.floor(interval) + " minuter";
        }
        return Math.floor(interval) + " minut";
    }

    // This won't format properly if comment was uploaded precisely 1 second ago
    // Will also display if the comment was uploaded in the future 
    return Math.floor(seconds) + " sekunder"; 
}