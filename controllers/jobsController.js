const createJob = async (req, res) => {
    res.send('create Job')
}

const deleteJob = async (req, res) => {
    res.send('delete Job')
}

const getAllJobs = async (req, res) => {
    res.send('get all Jobs')
}

const updateJob = async (req, res) => {
    res.send('update Job')
}

const showStats = async (req, res) => {
    res.send('show status')
}

export {createJob, deleteJob, getAllJobs, updateJob, showStats}