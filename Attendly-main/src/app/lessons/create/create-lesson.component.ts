import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  ToastController,
  ModalController,
  AlertController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonContent,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  fitnessOutline,
  informationCircleOutline,
  ribbonOutline,
  calendarOutline,
  listOutline,
  addCircleOutline,
  trashOutline,
  checkmarkCircleOutline,
  refreshOutline,
  videocamOutline
} from 'ionicons/icons';
import { Lesson, Technique, LessonService } from '../../services/lesson/lesson-service';

@Component({
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.component.html',
  styleUrls: ['./create-lesson.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonContent,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardContent,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class CreateLessonComponent implements OnInit, AfterViewInit {
  @Input() lessonData?: Lesson;
  @ViewChild(IonContent) ionContent!: IonContent;

  lessonForm: FormGroup;
  lessonImage: string | null = null;
  techniques: Technique[] = [];

  categories = ['Kids 1', 'Kids 2', 'Kids 3', 'Adultos Iniciantes', 'Adultos Avançados'];
  beltLevels = ['White', 'Grey', 'Yellow', 'Orange', 'Green', 'Blue', 'Purple', 'Brown', 'Black'];

  beltColors: { [key: string]: string } = {
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

  constructor(
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private lessonService: LessonService
  ) {
    addIcons({
      cameraOutline,
      fitnessOutline,
      informationCircleOutline,
      ribbonOutline,
      calendarOutline,
      listOutline,
      addCircleOutline,
      trashOutline,
      checkmarkCircleOutline,
      refreshOutline,
      videocamOutline
    });

    this.lessonForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      category: ['', Validators.required],
      beltLevel: ['', Validators.required],
      date: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(30), Validators.max(180)]],
      techName: [''],
      techDescription: [''],
      techVideoUrl: ['']
    });
  }

  get title() { return this.lessonForm.get('title'); }
  get category() { return this.lessonForm.get('category'); }
  get beltLevel() { return this.lessonForm.get('beltLevel'); }
  get date() { return this.lessonForm.get('date'); }
  get duration() { return this.lessonForm.get('duration'); }
  get techName() { return this.lessonForm.get('techName'); }
  get techDescription() { return this.lessonForm.get('techDescription'); }
  get techVideoUrl() { return this.lessonForm.get('techVideoUrl'); }

  ngOnInit() {
    if (this.lessonData) {
      this.lessonForm.patchValue(this.lessonData);
      this.techniques = [...this.lessonData.techniques];
    } else {
      const today = new Date().toISOString().split('T')[0];
      this.lessonForm.patchValue({ date: today });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.ionContent) {
        this.ionContent.scrollY = true;
      }
    }, 200);
  }

  // MÉTODO CORRIGIDO - SEM TAGS HTML
  async confirmDelete() {
    if (!this.lessonData?.id) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir a aula "${this.lessonData.title}"? Esta ação não pode ser desfeita.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Excluir',
          role: 'destructive',
          cssClass: 'danger',
          handler: () => {
            this.deleteLesson();
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteLesson() {
    if (!this.lessonData?.id) return;

    try {
      const success = await this.lessonService.deleteLesson(this.lessonData.id).toPromise();

      if (success) {
        const toast = await this.toastCtrl.create({
          message: 'Aula excluída com sucesso!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        await toast.present();

        this.modalCtrl.dismiss({
          deleted: true,
          lessonId: this.lessonData.id
        });
      } else {
        throw new Error('Falha ao excluir aula');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      const toast = await this.toastCtrl.create({
        message: 'Erro ao excluir aula. Tente novamente.',
        duration: 2500,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    }
  }

  async saveLesson() {
    if (!this.lessonForm.valid) {
      const toast = await this.toastCtrl.create({
        message: 'Please fill in all required fields correctly',
        duration: 2500,
        color: 'danger',
        position: 'top'
      });
      await toast.present();

      Object.keys(this.lessonForm.controls).forEach(key => {
        const control = this.lessonForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const duration = this.lessonForm.get('duration')?.value;
    if (duration < 30 || duration > 180) {
      const toast = await this.toastCtrl.create({
        message: 'Duration must be between 30 and 180 minutes',
        duration: 2500,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      return;
    }

    const lessonData: Lesson = {
      ...this.lessonForm.value,
      techniques: this.techniques,
      createdAt: this.lessonData?.createdAt || new Date()
    };

    try {
      if (this.lessonData?.id) {
        lessonData.id = this.lessonData.id;
        await this.lessonService.updateLesson(lessonData).toPromise();

        const toast = await this.toastCtrl.create({
          message: 'Lesson updated successfully!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        await toast.present();
      } else {
        await this.lessonService.createLesson(lessonData).toPromise();

        const toast = await this.toastCtrl.create({
          message: 'Lesson created successfully!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        await toast.present();
      }

      this.modalCtrl.dismiss({
        saved: true,
        data: lessonData
      });

    } catch (error) {
      console.error('Error saving lesson:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error saving lesson. Please try again.',
        duration: 2500,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    }
  }

  async onImageSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      const toast = await this.toastCtrl.create({
        message: 'Please select a valid image file',
        duration: 2500,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.lessonImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.lessonImage = null;
  }

  getBeltStyle(beltName: string): any {
    const color = this.beltColors[beltName] || '#666666';
    return {
      'background-color': color,
      'border': `2px solid ${this.darkenColor(color, 20)}`
    };
  }

  private darkenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  addTechnique() {
    if (this.techName?.value && this.techDescription?.value) {
      const newTechnique: Technique = {
        name: this.techName.value,
        description: this.techDescription.value,
        videoUrl: this.techVideoUrl?.value || '',
        imageUrl: ''
      };

      this.techniques.push(newTechnique);

      this.lessonForm.patchValue({
        techName: '',
        techDescription: '',
        techVideoUrl: ''
      });

      setTimeout(() => {
        if (this.ionContent) {
          this.ionContent.scrollToBottom(300);
        }
      }, 100);
    }
  }

  removeTechnique(index: number) {
    this.techniques.splice(index, 1);
  }

  resetForm() {
    this.lessonForm.reset({
      title: '',
      description: '',
      category: '',
      beltLevel: '',
      date: new Date().toISOString().split('T')[0],
      duration: 60,
      techName: '',
      techDescription: '',
      techVideoUrl: ''
    });
    this.techniques = [];
    this.lessonImage = null;

    Object.keys(this.lessonForm.controls).forEach(key => {
      const control = this.lessonForm.get(key);
      control?.markAsUntouched();
    });
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  validateDuration() {
    const durationControl = this.lessonForm.get('duration');
    if (durationControl?.value < 30) {
      durationControl.setValue(30);
    } else if (durationControl?.value > 180) {
      durationControl.setValue(180);
    }
  }
}
