const User = require('../model/userModel')
exports.getStaffs = async (req, res) => {
    try {
        const admin_id = req.params.id
        const staffs = await User.find({ admin_id })
        res.send(staffs)
    } catch (error) {
        res.status(401).json({
            status: 'failed',
            message: "Cannot find staffs"
        })
    }
}






