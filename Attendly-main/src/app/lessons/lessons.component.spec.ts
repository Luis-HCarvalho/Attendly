import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { of } from 'rxjs';

import { LessonsComponent } from './lessons.component';
import { LessonService, Lesson } from '../services/lesson/lesson-service';

describe('LessonsComponent', () => {
  let component: LessonsComponent;
  let fixture: ComponentFixture<LessonsComponent>;
  let lessonServiceSpy: jasmine.SpyObj<LessonService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  const mockLessons: Lesson[] = [
    {
      id: '1',
      title: 'Guarda Fechada',
      description: 'Aula sobre guarda fechada',
      category: 'Adultos Iniciantes',
      techniques: [],
      date: '2024-01-15',
      duration: 60,
      beltLevel: 'White',
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Posição Montada',
      description: 'Aula sobre posição montada',
      category: 'Adultos Avançados',
      techniques: [],
      date: '2024-01-16',
      duration: 90,
      beltLevel: 'Blue',
      createdAt: new Date()
    }
  ];

  beforeEach(waitForAsync(() => {
    const lessonService = jasmine.createSpyObj('LessonService', ['getLessons']);
    const modalController = jasmine.createSpyObj('ModalController', ['create']);

    TestBed.configureTestingModule({
      declarations: [LessonsComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: LessonService, useValue: lessonService },
        { provide: ModalController, useValue: modalController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LessonsComponent);
    component = fixture.componentInstance;
    lessonServiceSpy = TestBed.inject(LessonService) as jasmine.SpyObj<LessonService>;
    modalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;

    lessonServiceSpy.getLessons.and.returnValue(of(mockLessons));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load lessons on initialization', () => {
    fixture.detectChanges(); // Triggers ngOnInit

    expect(lessonServiceSpy.getLessons).toHaveBeenCalled();
    expect(component.lessons.length).toBe(2);
    expect(component.lessons[0].title).toBe('Guarda Fechada');
    expect(component.lessons[1].title).toBe('Posição Montada');
  });

  it('should format date correctly', () => {
    const formattedDate = component.formatDate('2024-01-15');
    expect(formattedDate).toBe('15/01/2024');
  });

  it('should return correct belt color style', () => {
    const whiteBeltStyle = component.getBeltColor('White');
    const blueBeltStyle = component.getBeltColor('Blue');
    const unknownBeltStyle = component.getBeltColor('Unknown');

    expect(whiteBeltStyle).toEqual({ "border": "2px solid #FFFFFF" });
    expect(blueBeltStyle).toEqual({ "border": "2px solid #60A5FA" });
    expect(unknownBeltStyle).toEqual({ "border": "2px solid #666666" });
  });

  it('should call openModal method', async () => {
    const mockModal = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ data: null }))
    };
    modalControllerSpy.create.and.returnValue(Promise.resolve(mockModal as any));

    await component.openModal();

    expect(modalControllerSpy.create).toHaveBeenCalled();
  });

  it('should call openModal with lesson data for editing', async () => {
    const mockModal = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ data: null }))
    };
    modalControllerSpy.create.and.returnValue(Promise.resolve(mockModal as any));

    const lessonToEdit = mockLessons[0];
    await component.openModal(lessonToEdit);

    expect(modalControllerSpy.create).toHaveBeenCalledWith({
      component: jasmine.any(Function),
      breakpoints: [0, 0.3, 0.5, 0.75, 0.9, 1],
      initialBreakpoint: 0.9,
      handle: true,
      handleBehavior: 'cycle',
      componentProps: { lessonData: lessonToEdit }
    });
  });
});
