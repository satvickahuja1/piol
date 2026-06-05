interface pageProp{
    params : Promise<{executionId:string}>
}

const executionIdPage = async({params}:pageProp) => {
    const {executionId} = await params
    return <div>
      Hii  {executionId}
    </div>
}
export default executionIdPage