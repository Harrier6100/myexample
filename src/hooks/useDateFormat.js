import moment from 'moment';

const useDateFormat = () => {
    const formatAt = (date) => moment(date).format('YYYY-MM-DD HH:mm:ss');
    const formatDate = (date) => moment(date).format('YYYY-MM-DD');
    return {
        formatAt,
        formatDate,
    };
};

export default useDateFormat;