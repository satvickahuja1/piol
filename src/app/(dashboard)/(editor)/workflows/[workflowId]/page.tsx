interface pageProp{
    params : Promise<{workflowId:string}>
}

const executionIdPage = async({params}:pageProp) => {
    const {workflowId} = await params
    return <div>
      Hii  {workflowId}
    </div>
}
export default executionIdPage