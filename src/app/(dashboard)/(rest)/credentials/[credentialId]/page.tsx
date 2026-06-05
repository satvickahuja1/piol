interface pageProp{
    params : Promise<{credentialId:string}>
}

const credentialIdPage = async({params}:pageProp) => {
    const {credentialId} = await params
    return <div>
      Hii  {credentialId}
    </div>
}
export default credentialIdPage