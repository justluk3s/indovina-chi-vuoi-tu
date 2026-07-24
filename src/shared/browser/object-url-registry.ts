export class ObjectUrlRegistry {
  private urls = new Set<string>();
  create(blob: Blob) {
    const url = URL.createObjectURL(blob);
    this.urls.add(url);
    return url;
  }
  revoke(url: string) {
    if (this.urls.delete(url)) URL.revokeObjectURL(url);
  }
  revokeAll() {
    for (const url of this.urls) URL.revokeObjectURL(url);
    this.urls.clear();
  }
}
