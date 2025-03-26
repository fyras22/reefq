declare module '*/ThreeScene' {
  interface SceneProps {
    metalType: 'gold' | 'silver' | 'platinum';
    gemType: 'diamond' | 'ruby' | 'sapphire' | 'emerald';
    size: number;
  }
  
  const Scene: React.FC<SceneProps>;
  export default Scene;
} 