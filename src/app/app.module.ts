import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { IonicStorageModule } from '@ionic/storage';
import { FileTransfer } from '@ionic-native/file-transfer';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { UserPage } from '../pages/user/user';
import { MessagesPage } from '../pages/messages/messages';
import { BrowsePage } from '../pages/browse/browse';
import { ProjectsPage } from '../pages/projects/projects';
import { NotificationsPage } from '../pages/notifications/notifications';
import { AccountPage } from '../pages/account/account';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { InfoPage } from '../pages/info/info';
import { AddressPage } from '../pages/address/address';
import { HeaderPage } from '../pages/header/header';
import { SignupPage } from '../pages/signup/signup';
import { OneSignal } from '@ionic-native/onesignal';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { HttpModule } from '@angular/http';
import { Device } from '@ionic-native/device';
import { LinkedIn } from '@ionic-native/linkedin';
import { EqualValidator} from '../validators/equal-validator';
import { LoaderPage } from '../pages/loader/loader';
import { AddressAutocompletePage } from '../pages/address-autocomplete/address-autocomplete';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { UserSkillsPage } from '../pages/user-skills/user-skills';
import { WorkingDaysPage } from '../pages/working-days/working-days';
import { PaymentMethodsPage } from '../pages/payment-methods/payment-methods';
import { NewPaymentMethodPage } from '../pages/new-payment-method/new-payment-method';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { CertificationsPage } from '../pages/certifications/certifications';
import { NewCertificationPage } from '../pages/new-certification/new-certification';
import { NewJobPage } from '../pages/new-job/new-job';
import { SkillAutocompletePage } from '../pages/skill-autocomplete/skill-autocomplete';
import { IonTagsInputModule } from "ionic-tags-input";
import { AddressVerificationPage } from '../pages/address-verification/address-verification';
import { AddressVerificationStatusPage } from '../pages/address-verification-status/address-verification-status';
import { IdentityVerificationPage } from '../pages/identity-verification/identity-verification';
import { IdentityVerificationStatusPage } from '../pages/identity-verification-status/identity-verification-status';
import { ConnectMapPage } from '../pages/connect-map/connect-map';
import { ElasticHeader } from '../directives/elastic-header/elastic-header';
import { ProfilePage } from '../pages/profile/profile';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { ProjectsFilterPage } from '../pages/projects-filter/projects-filter';
import { UpdateJobPage } from '../pages/update-job/update-job';
import { ViewJobPage } from '../pages/view-job/view-job';
import { LatestJobsPage } from '../pages/latest-jobs/latest-jobs';
import { ModalListPage } from '../pages/modal-list/modal-list';
import { SearchTalentPage } from '../pages/search-talent/search-talent';
import { IonRating } from '../pages/ion-rating/ion-rating';
import { JobDescriptionPage} from '../pages/job-description/job-description';
import { JobBidsPage} from '../pages/job-bids/job-bids';
import { JobFilesPage } from '../pages/job-files/job-files';


const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'abc0f6d2'
  }
};

let pages = [
  MyApp,
  HomePage,
  UserPage,
  DashboardPage,
  MessagesPage,
  BrowsePage,
  ProjectsPage,
  NotificationsPage,
  AccountPage,
  SignupPage,
  LoaderPage,
  InfoPage,
  HeaderPage,
  AddressPage,
  AddressAutocompletePage,
  ChangePasswordPage,
  UserSkillsPage,
  WorkingDaysPage,
  PaymentMethodsPage,
  NewPaymentMethodPage,
  CertificationsPage,
  NewCertificationPage,
  NewJobPage,
  SkillAutocompletePage,
  AddressVerificationPage,
  AddressVerificationStatusPage,
  IdentityVerificationPage,
  IdentityVerificationStatusPage,
  ConnectMapPage,
  ProfilePage,
  ProjectsFilterPage,
  UpdateJobPage,
  ViewJobPage,
  LatestJobsPage,
  ModalListPage,
  SearchTalentPage,
  JobDescriptionPage,
  JobBidsPage,
  JobFilesPage,
];

let declarationsArray = [
  MyApp,
  HomePage,
  UserPage,
  DashboardPage,
  MessagesPage,
  BrowsePage,
  ProjectsPage,
  NotificationsPage,
  AccountPage,
  SignupPage,
  LoaderPage,
  EqualValidator,
  InfoPage,
  HeaderPage,
  AddressPage,
  AddressAutocompletePage,
  ChangePasswordPage,
  UserSkillsPage,
  WorkingDaysPage,
  PaymentMethodsPage,
  NewPaymentMethodPage,
  CertificationsPage,
  NewCertificationPage,
  NewJobPage,
  SkillAutocompletePage,
  AddressVerificationPage,
  AddressVerificationStatusPage,
  IdentityVerificationPage,
  IdentityVerificationStatusPage,
  ConnectMapPage,
  ElasticHeader,
  ProfilePage,
  ProjectsFilterPage,
  UpdateJobPage,
  ViewJobPage,
  LatestJobsPage,
  ModalListPage,
  SearchTalentPage,
  IonRating,
  JobDescriptionPage,
  JobBidsPage,
  JobFilesPage,
];
export function declarations() {
  return declarationsArray;
}

export function entryComponents() {
  return pages;
}

@NgModule({
  declarations: declarations(),
  imports: [
    BrowserModule,
	HttpModule,
	IonTagsInputModule,
    IonicModule.forRoot(MyApp),
	IonicStorageModule.forRoot(),
	CloudModule.forRoot(cloudSettings),
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: [
    StatusBar,
    SplashScreen,
	IonicStorageModule ,
	GooglePlus,
	OneSignal,
	Facebook,
	Device,
	LinkedIn,
	File,
    Transfer,
    Camera,
    FilePath,
	FileTransfer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiServiceProvider,
  ]
})
export class AppModule {}
