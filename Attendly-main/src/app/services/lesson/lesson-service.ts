import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Technique {
  name: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface Lesson {
  id?: string;
  title: string;
  description: string;
  category: string;
  techniques: Technique[];
  date: string;
  duration: number;
  beltLevel: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private lessons: Lesson[] = [
    {
      id: '1',
      title: 'Guarda Fechada',
      description: 'Aula sobre os fundamentos da guarda fechada',
      category: 'Adultos Iniciantes',
      techniques: [
        {
          name: 'Saída básica de guarda fechada',
          description: 'Técnica fundamental para escapar da guarda fechada',
          videoUrl: 'https://exemplo.com/video1.mp4'
        }
      ],
      date: '2024-01-15',
      duration: 60,
      beltLevel: 'White',
      createdAt: new Date()
    }
  ];

  private lessonsSubject = new BehaviorSubject<Lesson[]>(this.lessons);

  constructor() { }

  getLessons(): Observable<Lesson[]> {
    return this.lessonsSubject.asObservable();
  }

  createLesson(lesson: Lesson): Observable<Lesson> {
    const newLesson: Lesson = {
      ...lesson,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.lessons.push(newLesson);
    this.lessonsSubject.next([...this.lessons]);
    return of(newLesson);
  }

  updateLesson(updatedLesson: Lesson): Observable<Lesson> {
    const index = this.lessons.findIndex(l => l.id === updatedLesson.id);
    if (index !== -1) {
      this.lessons[index] = { ...updatedLesson };
      this.lessonsSubject.next([...this.lessons]);
      return of(this.lessons[index]);
    }
    return of(null);
  }

  deleteLesson(lessonId: string): Observable<boolean> {
    const index = this.lessons.findIndex(l => l.id === lessonId);
    if (index !== -1) {
      this.lessons.splice(index, 1);
      this.lessonsSubject.next([...this.lessons]);
      return of(true);
    }
    return of(false);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
