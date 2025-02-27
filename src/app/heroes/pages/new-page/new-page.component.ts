import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/heroe.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm= new FormGroup({
    id:        new FormControl<string>(''),        
    superhero: new FormControl<string>('', {nonNullable: true}),         
    publisher: new FormControl<Publisher>(Publisher.DCComics),      
    alter_ego: new FormControl(''),        
    first_appearance: new FormControl(''),    
    characters:new FormControl(''),        
    alt_img:   new FormControl('')          
  }); // Formulario reactivo

  public publishers = [
    {id:'DC Comics', desc: 'DC - Comics'},
    {id:'Marvel Comics', desc: 'Marvel - Comics'},    
  ]
  
  constructor(
    private heroesService: HeroesService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  

  onSubmit(): void{
    if (this.heroForm.invalid) return;
    if (this.currentHero.id){
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackBar(`${hero.superhero} updated`);
          // TODO mostrar snackbar
        });
        return;
    }
    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
            //TODO mostrar snackbar, y navegar a heroes/edit/hero.id
            this.showSnackBar(`${hero.superhero} created`);
            this.router.navigate(['/heroes/edit', hero.id]);
      });
  }

  onDeleteHero(){
    if (!this.currentHero.id) throw Error ("Hero id is required");

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data:this.heroForm.value
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if(!result) return;
    //   this.heroesService.deleteHeroById(this.currentHero.id)
    //     .subscribe(wasDeleted => {
    //       if(wasDeleted)
    //         this.router.navigate(['/heroes']);
    //     })
     
    // });

    dialogRef.afterClosed()
      .pipe(
        filter((result:boolean)=> result),
        switchMap(()=> this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted:boolean) => wasDeleted),
      )
      .subscribe(wasDeleted => {
           this.router.navigate(['/heroes']);
      })
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'done', {
      duration:2500 // dos segundos y medio
    })
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesService.getHeroeByID(id))
      ).subscribe (hero => {
        if (!hero) return this.router.navigateByUrl('/');
        this.heroForm.reset(hero);
        return;
      })
    
  }

}
