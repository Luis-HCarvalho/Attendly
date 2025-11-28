import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonMenuButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonAvatar,
  ModalController
} from "@ionic/angular/standalone";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatRippleModule } from '@angular/material/core';
import { CreateLessonComponent } from './create/create-lesson.component';
import { LessonService, Lesson } from '../services/lesson/lesson-service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonMenuButton,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonAvatar, // ← MANTIDO porque é usado no template
    ScrollingModule,
    MatRippleModule
  ]
})
export class LessonsComponent {
  lessons: Lesson[] = [];

  constructor(
    private modalCtrl: ModalController,
    private lessonService: LessonService
  ) {
    this.lessonService.getLessons().subscribe((data) => {
      this.lessons = data;
    });
  }

  getBeltColor(beltLevel: string) {
    const colors: { [key: string]: string } = {
      'White': '#FFFFFF',
      'Grey': '#9CA3AF',
      'Yellow': '#FCD34D',
      'Orange': '#FB923C',
      'Green': '#4ADE80',
      'Blue': '#60A5FA',
      'Purple': '#A78BFA',
      'Brown': '#92400E',
      'Black': '#000000'
    };
    return { "border": `2px solid ${colors[beltLevel] || '#666666'}` };
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  async openModal(lessonData?: Lesson) {
    const modalOptions: any = {
      component: CreateLessonComponent,
      breakpoints: [0, 0.3, 0.5, 0.75, 0.9, 1],
      initialBreakpoint: 0.9,
      handle: true,
      handleBehavior: 'cycle'
    }

    if (lessonData) {
      modalOptions.componentProps = { lessonData: lessonData };
    }

    const modal = await this.modalCtrl.create(modalOptions);

    modal.onDidDismiss().then((result) => {
      if (result.data?.saved) {
        this.lessonService.getLessons().subscribe((data) => {
          this.lessons = data;
        });
      } else if (result.data?.deleted) {
        this.lessons = this.lessons.filter(lesson => lesson.id !== result.data.lessonId);
      }
    });

    await modal.present();
  }
}
