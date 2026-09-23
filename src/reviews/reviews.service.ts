import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { randomUUID } from 'crypto';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class ReviewsService implements OnModuleInit {
  private reviews: Review[] = []
  private readonly filePath: string
  private writeQueue: Promise<void> = Promise.resolve()

  constructor(private readonly eventEmitter: EventEmitter2) {
    const envPath = process.env.REVIEWS_FILE_PATH!
    
    this.filePath = path.resolve(process.cwd(), envPath)
  }

  async onModuleInit(){
      await this.loadFromFile()
    }
  
    private async loadFromFile(): Promise<void>{
      try{
        const content = await fs.readFile(this.filePath, "utf-8")
        this.reviews = content.trim()? JSON.parse(content) : []
      } catch(err : any){
        if(err.code === "ENOENT"){
          await fs.mkdir(path.dirname(this.filePath), {recursive : true})
          this.reviews = []
          await this.saveToFile()
        } else {
          throw err
        }
      }
    }
  
    private saveToFile(): Promise<void> {
      const snapshot = JSON.stringify(this.reviews, null, 2)
  
      this.writeQueue = this.writeQueue
      .catch(() => undefined)
      .then(async () => {
        const tmp = `${this.filePath}.tmp`
        await fs.writeFile(tmp, snapshot, "utf-8")
        await fs.rename(tmp, this.filePath)
      })
  
      return this.writeQueue
    }

  async create(placeId: string, createReviewDto: CreateReviewDto) {
    if (!placeId) {
      throw new NotFoundException(`L'id de l'endroit est requis pour créer un avis.`)
    }

    const now = new Date().toISOString()
    const newReview: Review = {
      id: `rev_${randomUUID().substring(0, 8)}`,
      placeId: placeId,
      ...createReviewDto,
      createdAt: now,
      updatedAt: now
    }

    this.reviews.push(newReview)

    this.eventEmitter.emit("review.changed", { placeId });

    await this.saveToFile()
    return newReview;
  }

  findAll() {
    return this.reviews;
  }

  findOne(id: string) {
    const review = this.reviews.find((r) => r.id === id)
    if(!review){
      throw new NotFoundException(`L'avis avec l'id '${id}' n'existe pas.`)
    }
    return review
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review: Review = this.findOne(id)
    Object.assign(review,updateReviewDto)
    review.updatedAt = new Date().toISOString()

    await this.saveToFile()
    return review
  }

  async remove(id: string) {
    const index: number =  this.reviews.findIndex((review: Review) => review.id === id);
    if(index === -1){
      throw new NotFoundException(`L'avis avec l'ID "${id}" n'existe pas.`);
    }

    const deletedReview = this.reviews.splice(index, 1)[0];

    this.eventEmitter.emit('review.changed', { placeId: deletedReview.placeId });
    await this.saveToFile()
  }

  findByPlace(placeId: string) {
    return this.reviews.filter((r) => r.placeId === placeId);
  }
}
