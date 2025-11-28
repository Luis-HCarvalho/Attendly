import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { CreateLessonComponent } from './create-lesson.component';
import { LessonService, Lesson, Technique } from '../../services/lesson/lesson-service';

describe('CreateLessonComponent', () => {
  let component: CreateLessonComponent;
  let fixture: ComponentFixture<CreateLessonComponent>;
  let lessonServiceSpy: jasmine.SpyObj<LessonService>;

  const mockLesson: Lesson = {
    id: '1',
    title: 'Guarda Fechada',
    description: 'Aula sobre guarda fechada',
    category: 'Adultos Iniciantes',
    techniques: [
      {
        name: 'Saída básica',
        description: 'Técnica de saída',
        videoUrl: 'https://example.com/video.mp4'
      }
    ],
    date: '2024-01-15',
    duration: 60,
    beltLevel: 'White',
    createdAt: new Date()
  };

  beforeEach(waitForAsync(() => {
    const lessonService = jasmine.createSpyObj('LessonService', [
      'createLesson',
      'updateLesson',
      'deleteLesson'
    ]);

    TestBed.configureTestingModule({
      declarations: [CreateLessonComponent],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        { provide: LessonService, useValue: lessonService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateLessonComponent);
    component = fixture.componentInstance;
    lessonServiceSpy = TestBed.inject(LessonService) as jasmine.SpyObj<LessonService>;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values when no lessonData', () => {
    component.ngOnInit();

    expect(component.lessonForm.get('title')?.value).toBe('');
    expect(component.lessonForm.get('duration')?.value).toBe(60);
    expect(component.lessonForm.get('date')?.value).toBeTruthy(); // Should have today's date
  });

  it('should patch form values when lessonData is provided', () => {
    component.lessonData = mockLesson;
    component.ngOnInit();

    expect(component.lessonForm.get('title')?.value).toBe('Guarda Fechada');
    expect(component.lessonForm.get('category')?.value).toBe('Adultos Iniciantes');
    expect(component.lessonForm.get('beltLevel')?.value).toBe('White');
    expect(component.techniques.length).toBe(1);
  });

  it('should validate required fields', () => {
    component.ngOnInit();

    const titleControl = component.lessonForm.get('title');
    const categoryControl = component.lessonForm.get('category');
    const beltLevelControl = component.lessonForm.get('beltLevel');
    const dateControl = component.lessonForm.get('date');
    const durationControl = component.lessonForm.get('duration');

    // Initially should be invalid
    expect(component.lessonForm.valid).toBeFalse();

    // Set required values
    titleControl?.setValue('Test Lesson');
    categoryControl?.setValue('Adultos Iniciantes');
    beltLevelControl?.setValue('White');
    dateControl?.setValue('2024-01-15');
    durationControl?.setValue(60);

    expect(component.lessonForm.valid).toBeTrue();
  });

  it('should validate title min length', () => {
    component.ngOnInit();
    const titleControl = component.lessonForm.get('title');

    titleControl?.setValue('Ab'); // Less than 3 characters
    expect(titleControl?.valid).toBeFalse();
    expect(titleControl?.errors?.['minlength']).toBeTruthy();

    titleControl?.setValue('ABC'); // Exactly 3 characters
    expect(titleControl?.valid).toBeTrue();
  });

  it('should validate duration range', () => {
    component.ngOnInit();
    const durationControl = component.lessonForm.get('duration');

    durationControl?.setValue(29); // Below minimum
    expect(durationControl?.valid).toBeFalse();

    durationControl?.setValue(181); // Above maximum
    expect(durationControl?.valid).toBeFalse();

    durationControl?.setValue(60); // Within range
    expect(durationControl?.valid).toBeTrue();
  });

  it('should add technique when form is valid', () => {
    component.ngOnInit();

    component.lessonForm.patchValue({
      techName: 'Armbar',
      techDescription: 'Armbar from guard'
    });

    component.addTechnique();

    expect(component.techniques.length).toBe(1);
    expect(component.techniques[0].name).toBe('Armbar');
    expect(component.techniques[0].description).toBe('Armbar from guard');
  });

  it('should not add technique when form is invalid', () => {
    component.ngOnInit();

    component.lessonForm.patchValue({
      techName: 'Armbar',
      techDescription: '' // Missing description
    });

    component.addTechnique();

    expect(component.techniques.length).toBe(0);
  });

  it('should remove technique by index', () => {
    component.ngOnInit();
    component.techniques = [
      { name: 'Tech 1', description: 'Desc 1' },
      { name: 'Tech 2', description: 'Desc 2' },
      { name: 'Tech 3', description: 'Desc 3' }
    ];

    component.removeTechnique(1);

    expect(component.techniques.length).toBe(2);
    expect(component.techniques[0].name).toBe('Tech 1');
    expect(component.techniques[1].name).toBe('Tech 3');
  });

  it('should return correct belt style', () => {
    const whiteBeltStyle = component.getBeltStyle('White');
    const blueBeltStyle = component.getBeltStyle('Blue');
    const unknownBeltStyle = component.getBeltStyle('Unknown');

    expect(whiteBeltStyle['background-color']).toBe('#FFFFFF');
    expect(blueBeltStyle['background-color']).toBe('#60A5FA');
    expect(unknownBeltStyle['background-color']).toBe('#666666');
  });

  it('should reset form correctly', () => {
    component.ngOnInit();

    // Fill form
    component.lessonForm.patchValue({
      title: 'Test Lesson',
      description: 'Test Description',
      category: 'Adultos Iniciantes',
      beltLevel: 'White'
    });
    component.techniques = [{ name: 'Test Tech', description: 'Test Desc' }];
    component.lessonImage = 'test-image-url';

    component.resetForm();

    expect(component.lessonForm.get('title')?.value).toBe('');
    expect(component.lessonForm.get('description')?.value).toBe('');
    expect(component.techniques.length).toBe(0);
    expect(component.lessonImage).toBeNull();
  });

  describe('saveLesson', () => {
    beforeEach(() => {
      lessonServiceSpy.createLesson.and.returnValue(of(mockLesson));
      lessonServiceSpy.updateLesson.and.returnValue(of(mockLesson));
    });

    it('should create new lesson when no lessonData', async () => {
      component.ngOnInit();

      // Fill required fields
      component.lessonForm.patchValue({
        title: 'New Lesson',
        category: 'Adultos Iniciantes',
        beltLevel: 'White',
        date: '2024-01-15',
        duration: 60
      });

      await component.saveLesson();

      expect(lessonServiceSpy.createLesson).toHaveBeenCalled();
      expect(lessonServiceSpy.updateLesson).not.toHaveBeenCalled();
    });

    it('should update existing lesson when lessonData provided', async () => {
      component.lessonData = mockLesson;
      component.ngOnInit();

      await component.saveLesson();

      expect(lessonServiceSpy.updateLesson).toHaveBeenCalled();
      expect(lessonServiceSpy.createLesson).not.toHaveBeenCalled();
    });
  });
});
