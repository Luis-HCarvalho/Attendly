import { TestBed } from '@angular/core/testing';
import { LessonService, Lesson, Technique } from './lesson-service';

describe('LessonService', () => {
  let service: LessonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return lessons', (done) => {
    service.getLessons().subscribe(lessons => {
      expect(lessons).toBeDefined();
      expect(Array.isArray(lessons)).toBe(true);
      done();
    });
  });

  it('should create a lesson', (done) => {
    const newLesson: Lesson = {
      title: 'Aula Teste',
      description: 'Descrição teste',
      category: 'Adultos Iniciantes',
      techniques: [],
      date: '2024-01-01',
      duration: 60,
      beltLevel: 'Branca'
    };

    service.createLesson(newLesson).subscribe(lesson => {
      expect(lesson).toBeDefined();
      expect(lesson.title).toBe('Aula Teste');
      expect(lesson.id).toBeDefined();
      done();
    });
  });
});
