import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { EventRatingPage } from '../event-rating/event-rating.page';
import { EventScorePage } from '../event-score/event-score.page';
import { LoginPage } from '../login/login.page';
import { SessionItemVM } from '../models/clientVM';
import { ClientMetaDataSyncResponseDTO, TimeSlotDTO } from '../models/serverDTO';
import { LocalDataService } from '../services/localData';
import { ServerAPIService } from '../services/serverAPI';
import { SyncService } from '../services/syncService';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    metaData: ClientMetaDataSyncResponseDTO;
    bookmarks: number[] = [];
    eventScore = 0;

    constructor(private localData: LocalDataService, private syncService: SyncService, private navCtrl: NavController, private modalCtrl: ModalController) { }

    async ngOnInit() {
        //setInterval(() => this.updateEventScore(), 10000);
        this.loadMetaData();
    }

    async ionViewWillEnter() {
        this.loadMetaData();
        this.updateEventScore();

        this.syncService.TrySyncAll()
            .then(() => {
                this.loadMetaData();
            });

        const user = this.localData.getCurrentUser();
        if(!user){
            const modal = await this.modalCtrl.create({
                component: LoginPage
            });

            await await modal.present();
        }

        this.bookmarks = this.localData.getSessionBookmarks();
    }

    loadMetaData = () => this.metaData = this.localData.getMetaData();
    updateEventScore = () => this.eventScore = this.localData.getEventScore();

    getSessionsVMForTimeSlot = (timeSlot: TimeSlotDTO): SessionItemVM[] => {
        let tracks = this.metaData.tracks;
        let sessions = this.metaData.sessions;

        return sessions
            .filter(s => s.timeSlotId == timeSlot.id)
            .sort((a, b) => a.timeSlotId - b.timeSlotId)
            .map(s => {
                return {
                    session: s,
                    track: tracks.find(t => t.id == s.trackId)
                }
            });
    }

    handleSessionSelected(vm: SessionItemVM) {
        this.navCtrl.navigateForward(['/session', vm.session.id]);
    }

    async handleShowEventRating() {
        const modal = await this.modalCtrl.create({
            component: EventRatingPage
        });

        await modal.present();
        await modal.onWillDismiss();
        
        await this.syncService.SyncAll();
        this.updateEventScore();
    }

    async handleShowGameScore() {
        const modal = await this.modalCtrl.create({
            component: EventScorePage
        });

        await modal.present();
        await modal.onWillDismiss();
    }



    isBookmarked = (sessionId: number) => this.bookmarks.indexOf(sessionId) != -1;
}
