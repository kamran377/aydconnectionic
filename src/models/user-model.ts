export class UserModel {
	imageUrl:any;
    constructor(public social_service_id: string, public first_name: string,
		public last_name: string,
		public email: string,
		public social_service: string,
		public gcm_id:string,
		public user_type_id: string,
		public scenario: string
		){
 
    }
	
	setUserType(id){
		this.user_type_id = id;
	}
	
}