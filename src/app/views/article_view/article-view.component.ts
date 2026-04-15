import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth_service/auth.service';
import { UploadService } from 'src/app/services/upload_service/upload.service';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.css'],
})
export class ArticleViewComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  form!: FormGroup;
  selectedType?: { name: string; subTypes: string[] };

  files:    File[]   = [];
  previews: string[] = [];

  uploading  = false;
  submitting = false;
  error      = '';

  articleTypes = [
    { name:'Homme',  subTypes:['Hauts et T-shirt','Pantalon','Chaussures','Manteaux et Vestes','Costumes','Autres'] },
    { name:'Femme',  subTypes:['Robe','Hauts','Sweats et Sweats a capuche','Pantalon et Leggings','Manteaux et veste','Jupe','Chaussures','Autres'] },
    { name:'Enfant', subTypes:['Hauts et T-shirt','Pantalon','Chaussures','Manteaux et Vestes','Autres'] },
    { name:'Livre',  subTypes:['Roman','BD','Manga','Autres'] },
    { name:'Autres', subTypes:['Accessoires','Electroniques'] },
  ];

  tips = [
    { icon:'fa-solid fa-camera', label:'Belles photos',       body:'Plusieurs angles, bonne lumière.' },
    { icon:'fa-solid fa-pen',    label:'Description précise', body:'Taille, état, matière, défauts.' },
    { icon:'fa-solid fa-bolt',   label:'Répondez vite',       body:'Les demandeurs attendent !' },
  ];

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private http:   HttpClient,
    private router: Router,
    private upload: UploadService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title:       ['', Validators.required],
      type:        ['', Validators.required],
      sous_type:   ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  pick(): void { this.fileInput.nativeElement.click(); }

  onFiles(evt: any): void {
    const list: FileList = evt.target.files;
    Array.from(list).forEach((f: any) => {
      this.files.push(f);
      const r = new FileReader();
      r.onload = (e: any) => this.previews.push(e.target.result);
      r.readAsDataURL(f);
    });
    evt.target.value = '';
  }

  remove(i: number): void {
    this.files.splice(i, 1);
    this.previews.splice(i, 1);
  }

  onTypeChange(): void {
    const t = this.form.value.type;
    this.selectedType = this.articleTypes.find(x => x.name === t);
    this.form.patchValue({ sous_type: '' });
  }

  get progress(): { done: boolean; label: string }[] {
    return [
      { done: this.files.length > 0,         label: 'Photos ajoutées' },
      { done: !!this.form.value.title,        label: 'Titre renseigné' },
      { done: !!this.form.value.type,         label: 'Catégorie choisie' },
      { done: !!this.form.value.description,  label: 'Description complète' },
    ];
  }

  submit(): void {
    if (this.form.invalid || !this.files.length) return;
    const user = this.auth.currentUser;
    if (!user) return;

    this.uploading = true;
    this.error = '';

    this.upload.uploadImages(this.files).subscribe({
      next: (res) => {
        if (!res.success) {
          this.uploading = false;
          this.error = "Erreur lors de l'upload des images.";
          return;
        }
        this.uploading  = false;
        this.submitting = true;

        const payload = {
          user,
          title:       this.form.value.title,
          type:        this.form.value.type,
          sous_type:   this.form.value.sous_type,
          description: this.form.value.description,
          images:      res.urls.map(url => ({ path: url })),
        };

        this.http.post('http://localhost:5000/article/addarticle', payload).subscribe({
          next: (r: any) => {
            this.submitting = false;
            if (r.success) this.router.navigate(['/acceuil'], { state: { articleCreated: true } });
            else this.error = "Erreur lors de la création.";
          },
          error: () => { this.submitting = false; this.error = "Erreur réseau."; },
        });
      },
      error: () => { this.uploading = false; this.error = "Erreur upload images."; },
    });
  }
}
