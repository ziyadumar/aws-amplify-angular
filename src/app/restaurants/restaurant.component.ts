import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Restaurant } from 'src/types/restaurant';
import { APIService, SearchableRestaurantFilterInput } from '../API.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {

  public createForm: FormGroup;
  searchText: any;

  /* declare restaurants variable */
  restaurants: Array<Restaurant>;


  constructor(private api: APIService, private fb: FormBuilder) { }

  async ngOnInit() {

    this.api.ListRestaurants().then(event => {
      this.restaurants = event.items;
    });

    this.api.OnCreateRestaurantListener.subscribe((event: any) => {
      const newRestaurant = event.value.data.onCreateRestaurant;
      this.restaurants = [newRestaurant, ...this.restaurants];
    });

    this.createForm = this.fb.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required],
      'city': ['', Validators.required]
    });
  }

  public onCreate(restaurant: Restaurant) {
    this.api.CreateRestaurant(restaurant).then(event => {
      console.log('item created!');
      this.createForm.reset();
    })
      .catch(e => {
        console.log('error creating restaurant...', e);
      });
  }

  async searchRest(text) {
    // console.log(eventa);
    this.searchText = text;
    console.log(this.searchText);
    const filter: SearchableRestaurantFilterInput = {
      name: { matchPhrasePrefix: this.searchText }
    };
    if (this.searchText === undefined || this.searchText === '') {
      this.api.ListRestaurants().then(event => {
        this.restaurants = event.items;
      });
    } else {
      this.api.SearchRestaurants(filter).then(event => {
        console.log(event);
        this.restaurants = event.items;
      });
    }

  }

}
