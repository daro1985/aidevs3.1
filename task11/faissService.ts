import faiss from 'faiss-node';
import path from 'path';
import fs from 'fs';

export class FaissVectorStore {
  private index: any;
  private baseDir: string;
  private indexPath: string;
  private metadataPath: string;
  private storagePath: string;
  private metadata: Map<number, string>;

  constructor(d: number, baseDir: string) {
    this.baseDir = baseDir;
    this.indexPath = path.join(this.baseDir, 'vector_index.faiss');
    this.metadataPath = path.join(this.baseDir, 'vector_metadata.json');
    this.storagePath = path.join(this.baseDir, 'storage');
    this.index = new faiss.IndexFlatIP(d);
    this.metadata = new Map<number, string>();
  }

  public getIndexTotal(): number {
    return this.index.ntotal();
  }

  public async load(): Promise<void> {
    try {
        // Create directory if it doesn't exist
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir, { recursive: true });
        }
        
        // Try to load existing index and metadata
        if (fs.existsSync(this.indexPath)) {
            this.index = faiss.Index.read(this.indexPath);
            if (fs.existsSync(this.metadataPath)) {
                const metadataContent = fs.readFileSync(this.metadataPath, 'utf8');
                this.metadata = new Map(JSON.parse(metadataContent));
            }
            console.log('Using existing index and metadata from file...');
        } else {
            console.log('Using new index from constructor...');
        }
    } catch (error) {
        console.error('Error loading index or metadata:', error);
    }
  }

  public async save(): Promise<void> {
    // Save the index to a file
    this.index.write(this.indexPath);
    fs.writeFileSync(this.metadataPath, JSON.stringify(Array.from(this.metadata.entries())));
    console.log('Index and metadata saved successfully');
  }

  public async add(vectors: number[][], document: string): Promise<void> {
    if (!vectors.length) {
        throw new Error('Empty vectors array provided');
    }

    try {
        const index = this.index.ntotal();
        this.index.add(vectors.flat());
        this.metadata.set(index, JSON.parse(document));
        await this.save();
        console.log('Vectors added successfully');
    } catch (error) {
        console.error('FAISS add error:', error);
        throw error;
    }
  }

  public async search(query: number[], k: number): Promise<any> {
    // Search for the k nearest neighbors of the query vector
    return this.index.search(query, k);
  }

  public getMetadata(index: number): string | undefined {
    return this.metadata.get(index);
  }
}


