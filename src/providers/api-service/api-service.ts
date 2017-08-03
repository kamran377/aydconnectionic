import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ApiServiceProvider {

	constructor(public http: Http) {
		console.log('Hello ApiServiceProvider Provider');
	}
  
	private baseUrl = "http://www.api.aydconnect.com/v1/";
  
	fullUrl(url) {
	  return this.baseUrl + url;
	}
  
	getProfileData(token) {
	  let url = this.fullUrl("users/profile-data");
	  let body = new FormData();
	  return this.authorizedRequest(url,token,body);
	}
	
	getUserProfileData(token, id) {
	  let url = this.fullUrl("users/user-profile-data");
	  let body = new FormData();
	  body.append('id',id);
	  return this.authorizedRequest(url,token,body);
	}
	
	getAddressData(token) {
	  let url = this.fullUrl("users/address-data");
	  let body = new FormData();
	  return this.authorizedRequest(url,token,body);
	}
	getCountries(token) {
	  let url = this.fullUrl("states/all");
	  let body = new FormData();
	  return this.authorizedRequest(url,token,body);
	}
  
	getSkillsAutoComplete(text) {
		const url = "http://www.api.aydconnect.com/v1/skills/all?term=" + text;
		return new Promise((resolve, reject) => {
			this.http.get(url)
			.subscribe(res => {
				resolve(res.json());
			}, (err) => {
				reject(err);
			});
		});
	}
  
  
	getSkills(token) {
	  let url = this.fullUrl("skills/skills");
	  let body = new FormData();
	  return this.authorizedRequest(url,token,body);
	}
  
	getCertifications(token) {
	  let url = this.fullUrl("certifications/all");
	  let body = new FormData();
	  return this.authorizedRequest(url,token,body);
	}
	
	getEmployerJobs(token, jobType) {
	  let url = this.fullUrl("jobs/all-employer");
	  let body = new FormData();
	  body.append('jobType',jobType);
	  return this.authorizedRequest(url,token,body);
	}
	getTalentJobs(token, jobType) {
	  let url = this.fullUrl("jobs/all-talent");
	  let body = new FormData();
	  body.append('jobType',jobType);
	  return this.authorizedRequest(url,token,body);
	}
	
	recommendedJobs(token,offset, skill) {
	  let url = this.fullUrl("jobs/recommended-jobs");
	  let body = new FormData();
	  body.append('offset',offset);
	  body.append('skill',skill);
	  
	  return this.authorizedRequest(url,token,body);
	}
	
	searchTalents(postData, token, offset) {
		let url = this.fullUrl("users/search-talents");
		let body = new FormData();
		body.append('identityVerified', postData.identityVerified);
		body.append('offset',offset);
		for(var i=0; i<postData.skills.length; i++) {
			body.append('skills[]', postData.skills[i]);
		}
		for(i=0; i<postData.addresses.length; i++) {
			body.append('addresses[]', postData.addresses[i]);
		}
		return  this.authorizedRequest(url, token, body);
	}
	
	getJobDetails(token, id) {
	  let url = this.fullUrl("jobs/job-details");
	  let body = new FormData();
	  body.append('jobId', id);
	  return this.authorizedRequest(url,token,body);
	}
	
	getJobFiles(token, id) {
	  let url = this.fullUrl("jobs/job-files");
	  let body = new FormData();
	  body.append('jobId', id);
	  return this.authorizedRequest(url,token,body);
	}
	
	getJobBidsDetails(token, id) {
	  let url = this.fullUrl("jobs/job-bids-details");
	  let body = new FormData();
	  body.append('jobId', id);
	  return this.authorizedRequest(url,token,body);
	}

	getDays(token) {
	  let url = this.fullUrl("working-days/working-days");
	  let body = new FormData();
	  return this.authorizedRequest(url,token,body);
	}
  
	getPaymetMethods(token) {
	  let url = this.fullUrl("payment-methods/all");
	  let body = new FormData();
	  return this.authorizedRequest(url,token,body);
	}
	
	getPhoneVerificationRequest(token) {
	  let url = this.fullUrl("verification/phone-verification-requests");
	  let body = new FormData();
	  return this.authorizedRequest(url,token,body);
	}

	deleteCertificate(id, token) {
		let url = this.fullUrl("certifications/delete-certificate");
		let body = new FormData();
		body.append('certificateId', id);
		return this.authorizedRequest(url,token,body);
	}
	
	deleteJob(id, token) {
		let url = this.fullUrl("jobs/delete-job");
		let body = new FormData();
		body.append('jobId', id);
		return this.authorizedRequest(url,token,body);
	}
	uploadJobFiles(token, jobID, imageStr) {
		let url = this.fullUrl("jobs/upload-job-file");
		let body = new FormData();
		body.append('jobId', jobID);
		body.append('imageStr', imageStr);
		return this.authorizedRequest(url,token,body);
	}
	deletePaymentMethods(id, token) {
	  let url = this.fullUrl("payment-methods/delete-method");
	  let body = new FormData();
	  body.append('methodId', id);
	  return this.authorizedRequest(url,token,body);
	}
	deleteJobFile(id, token) {
	  let url = this.fullUrl("jobs/delete-job-file");
	  let body = new FormData();
	  body.append('fileId', id);
	  return this.authorizedRequest(url,token,body);
	}
  
	saveAddressVerificationRequest(imageStr, token) {
		let url = this.fullUrl("verification/save-address-verification-requests");
		let body = new FormData();
		body.append('imageStr', imageStr);
		return  this.authorizedRequest(url, token, body);
	}
	
	updateProfilePicture(imageStr, token) {
		let url = this.fullUrl("users/update-profile-picture");
		let body = new FormData();
		body.append('imageStr', imageStr);
		return  this.authorizedRequest(url, token, body);
	}
	
	saveIdentityVerificationRequest(imageStr, token) {
		let url = this.fullUrl("verification/save-identity-verification-requests");
		let body = new FormData();
		body.append('imageStr', imageStr);
		return  this.authorizedRequest(url, token, body);
	}
  
	saveJob(postData, token) {
		let url = this.fullUrl("jobs/add");
		let body = new FormData();
		body.append('name', postData.title);
		body.append('description', postData.description);
		body.append('type_id',  postData.jobType);
		body.append('location',  postData.address);
		body.append('lat',  postData.lat);
		body.append('lng',  postData.lng);
		for(var i=0; i<postData.skills.length; i++) {
			body.append('skills[]', postData.skills[i]);
		}
		for(i=0; i<postData.imageStrs.length; i++) {
			body.append('imageStrs[]', postData.imageStrs[i]);
		}
		return  this.authorizedRequest(url, token, body);
	}

	saveAddressInfo(postData, token) {
		let url = this.fullUrl("users/update-address");
		let body = new FormData();
		body.append('street', postData.street);
		body.append('state', postData.state);
		body.append('city',  postData.city);
		body.append('suburb',  postData.neighbourhood);
		body.append('zip',  postData.postalCode);
		body.append('address',  postData.fullAddress);
		body.append('lat',  postData.lat);
		body.append('lng',  postData.lng);
		return  this.authorizedRequest(url, token, body);
	}
  
	saveUserSkills(postData, token) {
		let url = this.fullUrl("users/update-skills");
		let body = new FormData();
		for(var i=0; i<postData.length; i++) {
			body.append('skill_id[]', postData[i]);
		
		}
		 return  this.authorizedRequest(url, token, body);
	}

	saveUserWorkingDays(postData, token) {
		let url = this.fullUrl("users/update-working-days");
		let body = new FormData();
		for(var i=0; i<postData.length; i++) {
			body.append('day_id[]', postData[i]);
		}
		 return  this.authorizedRequest(url, token, body);
	}
  
	savePaymentMethod(stripeToken, token) {
		let url = this.fullUrl("payment-methods/add");
		let body = new FormData();
		body.append('stripeToken', stripeToken);
		return  this.authorizedRequest(url, token, body);
	}

	saveCertification(formData, token) {
		let url = this.fullUrl("certifications/add");
		let body = new FormData();
		body.append('name', formData.name);
		body.append('imageStr', formData.imageStr);
		return  this.authorizedRequest(url, token, body);
	}
	savePersonaInfo(postData, token) {
		let url = this.fullUrl("users/update-personal-info");
		let body = new FormData();
		body.append('firstName', postData.firstName);
		body.append('lastName', postData.lastName);
		body.append('mobile',  postData.mobile);
		body.append('description',  postData.description);
		return  this.authorizedRequest(url, token, body);
	}

	changePassword(postData, token) {
		let url = this.fullUrl("users/change-password");
		let body = new FormData();
		body.append('old_password', postData.oldPassword);
		body.append('new_password', postData.newPassword);
		body.append('password_repeat',  postData.repeatPassword);
		return  this.authorizedRequest(url, token, body);
	}

	authorizedRequest(url, token, formData) {
		return new Promise((resolve, reject) => {
			let headers = new Headers();
			headers.append("Accept","application/json");
			headers.append('Authorization', 'Bearer ' + token);
			this.http.post(url, formData, {headers: headers})
			.subscribe(res => {
				resolve(res.json());
			}, (err) => {
				reject(err);
			});
		});
	}

	login(postData) {
		let url = this.fullUrl("users/login");
		let body = new FormData();
		body.append('email', postData.email);
		body.append('password', postData.password);
		body.append('scenario', '1');
		
		return new Promise((resolve, reject) => {
			let headers = new Headers();
			headers.append("Accept","application/json");
			this.http.post(url, body, {headers: headers})
			.subscribe(res => {
				resolve(res.json());
			}, (err) => {
				reject(err);
			});
		});
	}

	signup(postData) {
		let url = this.fullUrl("users/signup");
		let body = new FormData();
		body.append('firstName', postData.firstName);
		body.append('lastName', postData.lastName);
		body.append('email', postData.email);
		body.append('password', postData.password);
		body.append('confirmPassword', postData.confirmPassword);
		body.append('gcm_id', postData.gcm_id);
		body.append('userType', postData.userType);
		
		return new Promise((resolve, reject) => {
			let headers = new Headers();
			headers.append("Accept","application/json");
			this.http.post(url, body, {headers: headers})
			.subscribe(res => {
				resolve(res.json());
			}, (err) => {
				reject(err);
			});
		});
	}

	socialLogin(postData) {
		let url = this.fullUrl("users/login");
		let body = new FormData();
		body.append('scenario', '2');
		body.append('social_service_id', postData.social_service_id);
		body.append('social_service', postData.social_service);
		body.append('first_name', postData.first_name);
		body.append('last_name', postData.last_name);
		body.append('email', postData.email);
		body.append('gcm_id', postData.gcm_id);
		body.append('user_type_id', postData.user_type_id);
		body.append('imageUrl', postData.imageUrl);
		
		return new Promise((resolve, reject) => {
			let headers = new Headers();
			headers.append("Accept","application/json");
			this.http.post(url, body, {headers: headers})
			.subscribe(res => {
				resolve(res.json());
			}, (err) => {
				reject(err);
			});
		});
	}
}
