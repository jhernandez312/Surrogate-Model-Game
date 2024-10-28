declare module 'three/examples/jsm/loaders/GLTFLoader' {
    import { Loader } from 'three';
    export class GLTFLoader extends Loader {
        load(
            url: string,
            onLoad: (gltf: unknown) => void, // Replace `any` with `unknown`
            onProgress?: (event: ProgressEvent) => void,
            onError?: (event: ErrorEvent) => void
        ): void;
    }
}
