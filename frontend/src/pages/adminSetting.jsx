function SettingHeader(){
    return(
        <>
            <div className="grid grid-cols-2 md:grid-cols-4">
                <div>Product Management</div>
                <div>Offer Management </div>
                <div>Coupon Management</div>
                <div>Order Management</div>
            </div>
        
        </>
    )
}
export default function AdminSetting(){
    return(
        <>
           <SettingHeader/>
        </>
    )
}