import Job from "../models/Job.js"
import {StatusCodes} from 'http-status-codes'
import {BadRequestError, NotFoundError, UnAuthenticatedError} from '../errors/index.js'
import checkPermissions from "../utils/checkPermissions.js"
import mongoose from "mongoose"
import moment from 'moment'


const createJob = async (req, res) => {
    const {position, company} = req.body    
    if(!position || !company){
        throw new BadRequestError('Please provide all values')
    }
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const deleteJob = async (req, res) => {
    const {id: jobId} = req.params
    const job = await Job.findOne({ _id : jobId})

    if(!job){
        throw new NotFoundError(`No job with id: ${jobId}`)
    }

    checkPermissions(req.user, job.createdBy)

    await job.deleteOne()
    res.status(StatusCodes.OK).json({msg: 'Success! Job removed'})
}

const getAllJobs = async (req, res) => {
    const {status, jobType, sort, search} = req.query

    const queryObject = {
        createdBy: req.user.userId
    }

    // conditions
    if(status !== 'all'){
        queryObject.status = status
    }

    if(jobType !== 'all'){
        queryObject.jobType = jobType
    }

    if(search){
        queryObject.position = {$regex: search, $options:'i'}
    }

    // NO AWAIT
    let result = Job.find(queryObject)

    //  Chain sort conditions
    if(sort === 'latest'){
        result = result.sort('-createdAt')
    }
    if(sort === 'oldest'){
        result = result.sort('createdAt')
    }
    if(sort === 'a-z'){
        result = result.sort('position')
    }
    if(sort === 'z-a'){
        result = result.sort('-position')
    }

    const jobs = await result

    res.status(StatusCodes.OK).json({jobs, totalJobs: jobs.length, numOfPages: 1})
}

const updateJob = async (req, res) => {
    const {id: jobId} = req.params
    const {company, position} = req.body

    if(!position || !company){
        throw new BadRequestError('Please provide all values!')
    }
    const job = await Job.findOne({ _id : jobId})

    if(!job){
        throw new NotFoundError(`No job with id: ${jobId}`)
    }    

    // check permissions
    checkPermissions(req.user, job.createdBy)

    const updateJob = await Job.findOneAndUpdate({_id:jobId}, req.body,{
        new: true,
        runValidators: true
    })
    res.status(StatusCodes.OK).json({updateJob})
}

const showStats = async (req, res) => {
    let stats = await Job.aggregate([
        {$match:{createdBy: new mongoose.Types.ObjectId(req.user.userId)}},   // aggregating jobs belonging to certain user(using userId)
        {$group: {_id: '$status', count: { $sum: 1}}}    // aggregating jobs on the basis of status of the job
    ])

    stats = stats.reduce((acc, curr) => {
        const {_id: title, count} = curr
        acc[title] = count
        return acc
    }, {})

    // Setting some default value so that if the user is new and has no jobs or less jobs, we can at least prevent the front end from breaking.
    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0
    }

    let monthlyApplications= await Job.aggregate([
        {$match: {createdBy: new mongoose.Types.ObjectId(req.user.userId)}},
        {
            $group: {
                _id:{
                    year:{
                        $year: '$createdAt'
                    },
                    month:{
                        $month: '$createdAt'
                    }
                },
                count: {$sum: 1}
            }
        },
        {$sort: {'_id.year': -1, '_id.month': -1}},
        {$limit: 6}    // limit the data to that of of last 6 months
    ])

    // Refactoring the data for ease at front-end
    monthlyApplications = monthlyApplications.map((item) => {
        const{_id: {year, month}, count} = item
        const date = moment().month(month-1).year(year).format('MMM Y')    // accepts value between 0-11
        return {date, count}
    }).reverse()

    res.status(StatusCodes.OK).json({defaultStats, monthlyApplications})
}

export {createJob, deleteJob, getAllJobs, updateJob, showStats}