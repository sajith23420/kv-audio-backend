export function getStudents(req,res){
    res.json(
        {
            message: "This is a get request from student route"
    })
}    

export function postStudents(req,res){
    res.json({
        message: "This is a post request from student route"
    })
}